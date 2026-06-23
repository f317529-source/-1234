const API_URL = "https://script.google.com/macros/s/AKfycbwew7BJbO215lD_6fDu3jpVMlsPKNC1_622hGI3f0LDd6laUEVsPh8bZaZ_Obog8Owf/exec";

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function submitData() {
  const name = document.getElementById("name").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const note = document.getElementById("note").value.trim();
  const files = document.getElementById("image").files;

  if (!name || !amount) {
    alert("請填寫人員與光數");
    return;
  }

  const images = [];

  for (let i = 0; i < files.length; i++) {
    const base64 = await fileToBase64(files[i]);

    images.push({
      fileName: files[i].name,
      imageBase64: base64
    });
  }

  const data = {
    name,
    amount,
    note,
    images
  };

  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("送出成功");

  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  document.getElementById("image").value = "";
  document.getElementById("image").addEventListener("change", function () {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";

  const files = this.files;

  if (!files || files.length === 0) {
    preview.textContent = "尚未選擇圖片";
    return;
  }

  for (const file of files) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "100%";
    img.style.marginTop = "10px";
    img.style.borderRadius = "12px";
    preview.appendChild(img);
  }
});
}
