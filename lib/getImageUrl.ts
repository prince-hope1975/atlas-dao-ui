export function getImageUrl(url: string) {
    const isIpfsString = url?.startsWith("ipfs://");
    // console.log({ url, isIpfsString });
    if (isIpfsString) {
      const ipfsHash = url.replace("ipfs://", "");
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      return ipfsUrl;
    }
    if (url?.startsWith("http")) {
      // if (url?.includes("ipfs")) {
      //   const index = url?.indexOf("ipfs");
      //   const _url = url?.slice(index, url.length - 1);
      //   const ipfsUrl = `https://ipfs.io/${_url}`;
      //   return ipfsUrl;
      // }
      return url;
    }
    if (url?.startsWith("template")) return "/icons/checkers.png";
    if (url) return `https://ipfs.io/ipfs/${url}`;
    return "";
  }