function removeTracking({ url }) {
  if (!REMOVER.mayContain(url)) {
    return
  }

  const redirectUrl = REMOVER.remove(url);

  if (redirectUrl === url) {
    return
  }

  return {
    redirectUrl
  }
}

const browser = window.browser || window.chrome;
browser.webRequest.onBeforeRequest.addListener(
  removeTracking,
  { urls: ['<all_urls>'], types: ['main_frame', 'sub_frame'] },
  ['blocking']
);