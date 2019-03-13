const Keywords = ['utm_',
                  'wt_',
                  'gcl',    // gclid (Alternate)
                  'ref',
                  'src',
                  'ext',
                  '_trk',
                  'mcID',   // Humblebundle Mail
                  'tt_',    // Twitch Mail
                  'eqrecqid'];

class REMOVER {

  static mayContain(url) {
    for (let keyword of Keywords) {
      if (url.includes(keyword))
        return true
    }
  }

  static remove(url) {
    const parsedURL = new URL(url);

    for (let param of [...parsedURL.searchParams.keys()]) {
      console.log(param);
      for (let keyword of Keywords) {
        if(param.startsWith(keyword))
          parsedURL.searchParams.delete(param)
      }
    }

    const parsedFragment = new URLSearchParams(parsedURL.hash.substring(1));
    for (let param of [...parsedFragment.keys()]) {
      for (let keyword of Keywords) {
        if(param.startsWith(keyword))
          parsedFragment.delete(param)
      }
    }

    return parsedURL.toString();
  }

}