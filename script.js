document.addEventListener('DOMContentLoaded', () => {
    const fileInputs = document.querySelectorAll('.file-input');

    fileInputs.forEach(input => {
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            const previewId = event.target.dataset.preview;
            const cnicInputId = event.target.dataset.cnicInput;
            const statusId = event.target.dataset.status;

            const preview = document.getElementById(previewId);
            const cnicInput = document.getElementById(cnicInputId);
            const status = document.getElementById(statusId);

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);

                status.textContent = 'Processing OCR...';

                try {
                    const { data: { text } } = await Tesseract.recognize(
                        file,
                        'eng',
                        {
                            logger: m => console.log(m)
                        }
                    );

                    const cnicRegex = /\d{5}-\d{7}-\d{1}/;
                    const match = text.match(cnicRegex);

                    if (match) {
                        cnicInput.value = match[0];
                        status.textContent = 'CNIC found!';
                    } else {
                        status.textContent = 'CNIC not found in image.';
                    }
                } catch (error) {
                    console.error('OCR Error:', error);
                    status.textContent = 'OCR failed.';
                }
            } else {
                preview.style.display = 'none';
                preview.src = '';
                cnicInput.value = '';
                status.textContent = '';
            }
        });
    });
});