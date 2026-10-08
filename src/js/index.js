const infoForm = document.getElementById("infoForm");
const inputForm = document.getElementById("inputForm");
const btnForm = document.getElementById("btnForm");

const btnCriar = document.getElementById("btn-criar");
const btnLer = document.getElementById("btn-ler");

const result = document.getElementById("result");

const qrImage = document.getElementById("qrImage");
const qrText = document.getElementById("qrText");

let tipo = "criar";

function tabCriar() {
  tipo = "criar";

  infoForm.innerText = "Insira seu Link";

  inputForm.type = "text";
  inputForm.placeholder = "https://www.google.com.br";
  inputForm.classList.remove("input--file");

  btnForm.innerText = "Gerar";

  btnCriar.classList.add("tab--active");
  btnLer.classList.remove("tab--active");

  result.style.display = "none";
  qrImage.style.display = "none";
  qrText.innerText = "";
}

function tabLer() {
  tipo = "ler";

  infoForm.innerText = "Selecione um QR Code";

  inputForm.type = "file";
  inputForm.accept = "image/*";
  inputForm.classList.add("input--file");

  btnForm.innerText = "Ler";

  btnLer.classList.add("tab--active");
  btnCriar.classList.remove("tab--active");

  result.style.display = "none";
  qrImage.style.display = "none";
  qrText.innerText = "";
}

btnForm.addEventListener("click", () => {

  if (tipo === "criar") {
    generateQR();
  }

  if (tipo === "ler") {
    readQR();
  }

});

async function generateQR() {
  const value = inputForm.value.trim();

  if (!value) {
    alert("Insira um link primeiro.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(value)}`
    );

    if (!response.ok) {
      throw new Error("Erro ao gerar QR Code.");
    }

    const blob = await response.blob();

    const qrUrl = URL.createObjectURL(blob);

    result.style.display = "flex";

    qrImage.src = qrUrl;
    qrImage.style.display = "block";

    qrText.innerText = value;

  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);

    alert("Não foi possível gerar o QR Code.");
  }
}


async function readQR() {
  const file = inputForm.files[0];

  if (!file) {
    alert("Selecione uma imagem de QR Code.");
    return;
  }

  const formData = new FormData();

  formData.append("file", file);

  try {
    const response = await fetch(
      "https://api.qrserver.com/v1/read-qr-code/",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao enviar a imagem.");
    }

    const data = await response.json();

    console.log(data);

    const qrData = data?.[0]?.symbol?.[0]?.data;

    if (!qrData) {
      alert("Não foi possível encontrar um QR Code nessa imagem.");
      return;
    }

    console.log("Conteúdo do QR Code:", qrData);

    qrText.innerText = qrData;

    result.style.display = "flex";

  } catch (error) {
    console.error("Erro ao ler QR Code:", error);

    alert("Não foi possível ler o QR Code.");
  }
}

