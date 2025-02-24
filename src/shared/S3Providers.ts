import S3Provider from './S3Provider';

export default class S3Providers {
  providers: Array<S3Provider>;

  constructor() {
    this.providers = [];
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.providers.length) {
          const value = this.providers[index];
          index += 1;
          return { value, done: false };
        }
        return { done: true };
      },
    };
  }
}
