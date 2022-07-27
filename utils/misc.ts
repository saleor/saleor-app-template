export const isInIframe = () => {
  try {
    return document.location !== window.parent.location;
  } catch (e) {
    return false;
  }
};
