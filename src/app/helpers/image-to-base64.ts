/**
 * get image 
 * 
 * 
 * @param event 
 */
export function getImage(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
    };
}