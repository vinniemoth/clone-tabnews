function status(request, response) {
  response
    .status(200)
    .json({ mensagem: "Alunos do curso.dev são pessoas massinha" });
}

export default status;
