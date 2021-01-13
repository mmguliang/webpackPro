/*
 * @Author: your name
 */
import $ from 'jquery'
function print(name,age){
  $('.title').html('print: Hello, webpack')
  return {name, age, other: 'something'}
}
 export default print
