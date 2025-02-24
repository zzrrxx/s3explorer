/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import S3Providers from 'src/shared/S3Providers';
import S3Provider from 'src/shared/S3Provider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character.' }),
  s3Type: z.string().min(1, { message: 'Please select a S3 Type.' }),
  accessKeyID: z
    .string()
    .min(1, { message: 'Access Key ID must be at least 1 characters.' }),
  secretAccessKey: z
    .string()
    .min(1, { message: 'Secret Access Key must be at least 1 characters.' }),
});

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [s3Providers, setS3Providers] = useState<S3Providers | null>(null);
  const [provider, setProvider] = useState<S3Provider | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      accessKeyID: '',
      secretAccessKey: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    window.electron.ipcRenderer.once('getS3Providers', (arg) => {
      const providers: S3Providers = arg as S3Providers;
      setS3Providers(providers);
      setProvider(providers.providers[0]);
    });
    window.electron.ipcRenderer.sendMessage('getS3Providers', []);
  }, [form]);

  if (s3Providers === null || provider === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Add S3 Account</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Account Name" {...field} required />
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
                      onValueChange={field.onChange}
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

              <FormField
                control={form.control}
                name="accessKeyID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Access Key ID" {...field} required />
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

              <Button type="submit">Add</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
