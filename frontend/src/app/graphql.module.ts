import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<unknown> {
  const http = httpLink.create({ uri: environment.graphqlUri });

  const auth = setContext(() => {
    const token = localStorage.getItem('emp_auth_token');
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
  });

  return {
    link: ApolloLink.from([auth, http]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'all' },
      query:      { errorPolicy: 'all' }
    }
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
