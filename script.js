const API_URL = "https://script.google.com/macros/s/AKfycbzQX6va2_6VzbV6hiN5O6gMP4_H2Cmx9MQsM8W8Ky9CcfwvPDXzRyuQ7b9iv6pVjaU/exec";

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return preview.textContent = "尚未選擇圖片";
  const reader = new FileReader();
  reader.onload = () => preview.innerHTML = `<img src="${reader.result}" alt="結圖預覽">`;
  reader.readAsDataURL(file);
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function submitData() {
  const btn = document.getElementById("btn");
  const msg = document.getElementById("msg");
  const name = document.getElementById("name").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const note = document.getElementById("note").value.trim();
  const file = imageInput.files[0];

  if (!name || !amount || !file) return msg.textContent = "請填收光人員、光數，並上傳結圖。";

  btn.disabled = true; msg.textContent = "送出中...";
  try {
    const imageBase64 = await fileToBase64(file);
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, amount, note, imageBase64, fileName: file.name })
    });
    msg.textContent = "登記成功！";
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";
    imageInput.value = "";
    preview.textContent = "尚未選擇圖片";
  } catch (e) {
    msg.textContent = "送出失敗，請檢查 Apps Script 網址。";
  }
  btn.disabled = false;
}
