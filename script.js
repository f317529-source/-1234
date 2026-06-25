// 這裡換成你的 Apps Script Web App 網址，必須是 /exec 結尾
const API_URL = "https://script.google.com/macros/s/AKfycbzcMrVXd6SQRmCuuK22nbd04Z8p_EviX3voJ9r2ZICbdwR6WIYNvpdXwRt0I-UcSoa2/exec";

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const fileText = document.getElementById("fileText");

imageInput.addEventListener("change", () => {
  preview.innerHTML = "";
  const files = Array.from(imageInput.files || []);

  if (files.length === 0) {
    preview.classList.add("empty");
    preview.textContent = "尚未選擇圖片";
    fileText.textContent = "尚未選擇任何檔案";
    return;
  }

  preview.classList.remove("empty");
  fileText.textContent = `${files.length} 個檔案`;

  files.forEach(file => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);
    preview.appendChild(img);
  });
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setStatus(text, type) {
  const status = document.getElementById("statusMsg");
  status.className = `status-msg ${type || ""}`;
  status.textContent = text;
}

async function submitData() {
  const name = document.getElementById("name").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const note = document.getElementById("note").value.trim();
  const btn = document.getElementById("submitBtn");

  if (!API_URL || API_URL.includes("請貼上")) {
    setStatus("❌ 請先在 script.js 貼上 Apps Script 網址", "error");
    return;
  }
  if (!name || !amount) {
    setStatus("❌ 請填寫收光人員與光數", "error");
    return;
  }

  try {
    btn.disabled = true;
    btn.textContent = "送出中...";
    setStatus("正在上傳資料，請稍等...", "");

    const files = Array.from(imageInput.files || []);
    const images = [];

    for (const file of files) {
      const imageBase64 = await fileToBase64(file);
      images.push({ fileName: file.name, imageBase64 });
    }

    const payload = { name, amount: Number(amount), note, images };

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });

    setStatus("✅ 光數登記成功", "success");
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";
    imageInput.value = "";
    fileText.textContent = "尚未選擇任何檔案";
    preview.classList.add("empty");
    preview.textContent = "尚未選擇圖片";

  } catch (err) {
    setStatus("❌ 登記失敗，請檢查網路或 Apps Script", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "送出登記";
  }
}

preview.classList.add("empty");
