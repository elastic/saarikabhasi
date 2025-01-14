/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Entity } from '../entity';
import { ApmFields } from './apm_fields';
import { ServerlessInstance } from './serverless_instance';

export class ServerlessFunction extends Entity<ApmFields> {
  instance({ instanceName, ...apmFields }: { instanceName: string } & ApmFields) {
    return new ServerlessInstance({
      ...this.fields,
      ['service.node.name']: instanceName,
      'host.name': instanceName,
      ...apmFields,
    });
  }
}

export function serverlessFunction({
  functionName,
  serviceName,
  environment,
  agentName,
}: {
  functionName: string;
  environment: string;
  agentName: string;
  serviceName?: string;
}) {
  const faasId = `arn:aws:lambda:us-west-2:001:function:${functionName}`;
  return new ServerlessFunction({
    'service.name': serviceName || faasId,
    'faas.id': faasId,
    'faas.name': functionName,
    'service.environment': environment,
    'agent.name': agentName,
    'service.runtime.name': 'AWS_lambda',
  });
}
