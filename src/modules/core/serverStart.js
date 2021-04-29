const PORT = +process.env.PORT || 8000;

// ===== START SERVER =====//
const server = (app) =>
  app.listen(PORT, () => {
    console.log(
      `Node cluster worker ${process.pid}: listening on port ${PORT} - env: ${process.env.NODE_ENV}`,
    );
  });

export default server;
