'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN;
const FB_PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

if (!WIT_TOKEN) {
    throw new Error('Missing WIT_TOKEN.');
}

if (!FB_PAGE_TOKEN) {
    throw new Error('Missing FB_PAGE_TOKEN');
}

if (!FB_VERIFY_TOKEN) {
    throw new Error('Missing FB_VERIFY_TOKEN');
}

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}