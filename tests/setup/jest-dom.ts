import '@testing-library/jest-dom';
import 'node-fetch';

// 添加 Request 和 fetch polyfill
global.Request = require('node-fetch').Request;
global.fetch = require('node-fetch'); 