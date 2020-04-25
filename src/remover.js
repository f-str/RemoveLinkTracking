const Keywords = ['utm_',
                  'wt_',
                  'refID',
                  'src',
                  'ext',
                  '_trk',
                  'mcID',
                  'tt_',
                  'eqrecqid',
                  'fbclid',
                  'yclid',
                  'gclid',
                  'wc_mc',
                  'amp',
                  'clickin',
                  'AffiliateID',
                  'campid',
                  'pf_rd',
                  'hmb_',
                  'igshid',
                  'fb',
                  'service',
                  'algo_',
                  'spm',
                  'btsid',
                  'ws_ab_',
                  'action',
                  'module',
                  'pgtype'];

class REMOVER {

    static mayContain(url) {
            for (let keyword of Keywords) {
                if (url.includes(keyword))
                    return true
            }
        return false;
    }

    static remove(url) {
        const parsedURL = new URL(url);

        for (let param of [...parsedURL.searchParams.keys()]) {
            for (let keyword of Keywords) {
                if (param.startsWith(keyword))
                    parsedURL.searchParams.delete(param);
            }
        }

        const parsedFragment = new URLSearchParams(parsedURL.hash.substring(1));
        for (let param of [...parsedFragment.keys()]) {
            for (let keyword of Keywords) {
                if (param.startsWith(keyword))
                    parsedFragment.delete(param)
            }
        }

        return parsedURL.toString();
    }
}
