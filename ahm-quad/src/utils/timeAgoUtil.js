export const calculateTimeAgo = (timestamp) => {
  const alertTime = new Date(timestamp).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = Math.max(currentTime - alertTime, 0); // Prevent negative differences

  if (timeDifference < 60000) {
      return `${Math.floor(timeDifference / 1000)}s ago`;
  } else if (timeDifference < 3600000) {
      return `${Math.floor(timeDifference / 60000)}min ago`;
  } else if (timeDifference < 86400000) {
      return `${Math.floor(timeDifference / 3600000)}hr ago`;
  } else if (timeDifference < 2592000000) {
      return `${Math.floor(timeDifference / 86400000)} days ago`;
  } else if (timeDifference < 31536000000) {
      return `${Math.floor(timeDifference / 2592000000)} month(s) ago`;
  } else {
      return `${Math.floor(timeDifference / 31536000000)} year(s) ago`;
  }
};
