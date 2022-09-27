#!/usr/bin/env node
import * as commander from 'commander';
import {translate} from './main';

const program = new commander.Command();

program.version('0.0.1')
  .name('t')
  .description('translate')
  // 强制要求参数
  .usage('<English>')
  // 获取参数
  .arguments('<English>')
  .action(function (word) {
    translate(word);
  });

program.parse(process.argv);