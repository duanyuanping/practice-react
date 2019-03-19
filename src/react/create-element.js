export default (tag, attrs, ...children) => {
  // if (typeof tag.props === 'object') {
  //   Object.entries(tag.props).forEach(item => attrs[item[0]] = item[1])
  // }
  // console.log(tag, attrs, children)
  return {
    tag,
    attrs,
    children
  }
};