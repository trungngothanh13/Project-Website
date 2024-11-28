// Hàm để hiển thị div và thay đổi hình ảnh tương ứng
function showInfo(infoId) {
    // Ẩn tất cả các div (info và info2)
    document.getElementById('info1').style.display = 'none';
    document.getElementById('info2').style.display = 'none';

    // Hiển thị div tương ứng với infoId
    document.getElementById(infoId).style.display = 'block';

    // Ẩn tất cả các hình ảnh
    document.getElementById('image1').style.display = 'none';
    document.getElementById('image2').style.display = 'none';

    // Hiển thị hình ảnh tương ứng với infoId
    if (infoId === 'info1') {
        document.getElementById('image1').style.display = 'block'; // Hiển thị hình ảnh đầu tiên
    } else if (infoId === 'info2') {
        document.getElementById('image2').style.display = 'block'; // Hiển thị hình ảnh thứ hai
    }
}
