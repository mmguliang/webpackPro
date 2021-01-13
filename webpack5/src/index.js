
function component() {
  let element = document.createElement('div');
  element.innerHTML = 'index: Hello, webpack';
  element.classList.add('title');
  return element;
}
document.body.append(component());