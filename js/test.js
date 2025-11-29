localStorage.clear()
sessionStorage.clear()

Swal.fire({
    toast: true,
    position: 'center',
    icon: 'success',
    title: 'Borrando datos',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
}).then(() => location.href="../index.html")