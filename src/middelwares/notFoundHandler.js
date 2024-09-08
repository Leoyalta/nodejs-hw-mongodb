const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `${req.url} Route not found`,
  });
};

export default notFoundHandler;
