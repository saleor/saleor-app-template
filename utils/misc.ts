export const isInIframe = () => {
  try {
    return document.location.hostname !== window.parent.location.hostname;
  } catch (e) {
    return true;
  }
};
