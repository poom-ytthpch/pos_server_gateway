import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.config.env']
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // ... Apollo server options
        introspection: true,
        playground: false,
        plugins: [
          ApolloServerPluginLandingPageLocalDefault({ embed: true }),
          ApolloServerPluginInlineTraceDisabled()
        ],
        cors: {
          origin: ["https://sandbox.embed.apollographql.com", "http://localhost:3000"]
        },
      },
      gateway: {
        serviceList: [
          { name: 'auth', url: 'http:/0.0.0.0:4011/graphql' },
          { name: 'product', url: 'http:/0.0.0.0:4012/graphql' },
        ],
        buildService({ url }) {
          return new (class extends RemoteGraphQLDataSource {
            willSendRequest({ request, context }) {
              context.req?.headers ? request.http.headers.set('authorization', context.req?.headers?.authorization) : null;
            }
          })({ url });
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
