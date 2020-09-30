import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStream(): string {
    //TODO: add as body/params
    const username = 'user';
    const tweetId =  'tweet';
    return this.appService.getStream(username, tweetId);
  }
}
