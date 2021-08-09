import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { configService } from '../config/config.service';

@Injectable()
export class AwsService {
    public sns = new SNS({
        ...configService.getAWSConfig().sns
    });

    public async sns_publish(params) {
        console.log('sns_publish', params, this.sns.publish);
        return this.sns.publish(params).promise()
            .catch(console.log)
    }
}
