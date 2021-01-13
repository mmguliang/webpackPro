import $ from 'jquery'
import print from './print.js'
import Favicon from './images/favicon.png';

import './css/index.css'
import './less/index.less'

console.log(haha);
function component() {
  let element = document.createElement('div');
  let buttonEl = document.createElement('button');
  
  element.innerHTML = 'index: Hello, webpack';
  element.classList.add('title');
  
  let myIcon = new Image();
  myIcon.src = Favicon;
  document.body.appendChild(myIcon);

  buttonEl.innerHTML = 'printMe';
  document.body.appendChild(buttonEl);
  return element;
}
console.log('index');
$('#app').append(component());

$("button").click(function(){
  console.log(print('kris', 18))
  // import(/* webpackChunkName: 'some', webpackPrefetch: true */'./print.js').then(other => {
  //   console.log(other('kris', 18))
  // })
});

// if (module.hot) {
//   module.hot.accept('./print.js', function() {
//     console.log('Accepting the updated printMe module!');
//     console.log(print('kris', 18))
//   })
// }

/* pwa离线缓存，配合WorkboxWebpackPlugin插件 */
if ('serviceWorker' in navigator) { // 注册Service Worker，处理兼容性问题
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // 注册serviceWorker
      .then(() => {
        console.log('sw注册成功了~');
      })
      .catch(() => {
        console.log('sw注册失败了~');
      });
  });
}