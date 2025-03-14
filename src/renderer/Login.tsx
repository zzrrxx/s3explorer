/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */

import { GalleryVerticalEnd } from 'lucide-react';
import { z } from 'zod';
import S3Providers from 'src/shared/S3Providers';
import { useEffect, useState } from 'react';
import S3Provider from 'src/shared/S3Provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import S3Account from 'src/shared/S3Account';
import { isApiError } from 'src/shared/ApiError';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name must be at least 1 character.' }),
    s3Type: z.string().min(1, { message: 'Please select a S3 Type.' }),
    accessKeyID: z
      .string()
      .min(1, { message: 'Access Key ID must be at least 1 characters.' }),
    secretAccessKey: z
      .string()
      .min(1, { message: 'Secret Access Key must be at least 1 characters.' }),
    endpoint: z.string().optional(),
  })
  .superRefine((data, ctx: z.RefinementCtx) => {
    if (
      data.s3Type === 'Custom' &&
      (!data.endpoint || data.endpoint.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endpoint'],
        message: 'Endpoint is required when S3 Type is Custom',
      });
    }
  });

export default function LoginPage() {
  const navigate = useNavigate();

  const [s3Providers, setS3Providers] = useState<S3Providers | null>(null);
  const [provider, setProvider] = useState<S3Provider | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      s3Type: '',
      endpoint: '',
      accessKeyID: '',
      secretAccessKey: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (s3Providers === null) return;

    const acct: S3Account = {
      name: values.name,
      endpoint: '',
      accessKey: values.accessKeyID,
      secretKey: values.secretAccessKey,
      region: '',
      useTls: false,
      useVirtualHostingPath: false,
    };

    if (values.s3Type === 'Custom') {
      acct.endpoint = values.endpoint || '';
    } else {
      const curProvider = s3Providers.providers.find((prov: S3Provider) => {
        return prov.name === values.s3Type;
      });
      if (curProvider === null || curProvider === undefined) return;

      const endpoint = curProvider.endpoints.find(
        (value) => value.region === curProvider.defaultRegion,
      );
      if (endpoint) {
        acct.endpoint = endpoint.url;
      }
      acct.useTls = curProvider.useTLS;
      acct.useVirtualHostingPath = curProvider.useVirtualHostingPath;
    }

    window.electron.ipcRenderer.sendMessage('addAccount', acct);
  }

  const handleValueChange = (value: string) => {
    form.setValue('s3Type', value, { shouldValidate: true });

    const curProvider = s3Providers?.providers.find((prov: S3Provider) => {
      return prov.name === value;
    });
    setProvider(curProvider || null);
  };

  useEffect(() => {
    const unsubGetS3Provicers = window.electron.ipcRenderer.on(
      'getS3Providers',
      (arg: any) => {
        const providers: S3Providers = arg as S3Providers;
        setS3Providers(providers);
        setProvider(providers.providers[0]);
      },
    );
    window.electron.ipcRenderer.sendMessage('getS3Providers', []);

    const unsubAddAccount = window.electron.ipcRenderer.on(
      'addAccount',
      (arg: any) => {
        if (isApiError(arg)) {
          toast.error(`Add acount failed: ${arg.code}: ${arg.message}`);
        } else {
          navigate('/');
        }
      },
    );

    return () => {
      unsubGetS3Provicers();
      unsubAddAccount();
    };
  }, [form, navigate]);

  if (s3Providers === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          S3 Explorer
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Add S3 Account</CardTitle>
              <CardDescription />
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Account Name"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="s3Type"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>S3 Type</FormLabel>
                        <Select
                          onValueChange={handleValueChange}
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a S3 Type" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {s3Providers.providers.map((p) => (
                              <SelectItem value={p.name} key={p.name}>
                                {p.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="Custom" key="Custom">
                              Custom
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {provider === null && (
                    <FormField
                      control={form.control}
                      name="endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endpoint</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Custom endpoint: [http/https]://host:port/url"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="accessKeyID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Key ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Access Key ID"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secretAccessKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secret Access Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Secret Access Key"
                            type="password"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-8">
                    <Button
                      type="button"
                      className="w-full"
                      variant="secondary"
                    >
                      Advanced
                    </Button>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
