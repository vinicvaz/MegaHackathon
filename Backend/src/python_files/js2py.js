product_id = 0;
question = "Voce poderia fazer outro anuncio?";

const spawn = require("child_process").spawn;
const pythonProcess = spawn("python3", ["teste.py", product_id, question]);

pythonProcess.stdout.on("data", (data) => {
  str_data = data.toString().trim();

  //array_data = str_data.split("\n");

  //results_json = JSON.parse(array_data[array_data.length - 1]);

  console.log(str_data);
});
