import PropTypes from "prop-types";

const Spinner = ({ size = 16, color = "blue-500" }) => {
  const dimension = `${size * 4}px`; // Convert size to pixel dimensions
  return (
    <div
      className={`animate-ping rounded-full bg-${color} absolute left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4`}
      style={{ width: dimension, height: dimension }}
      aria-label="Loading"></div>
  );
};

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Spinner;
