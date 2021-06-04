const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'margin-top',
  'margin-right',
  'margin-left',
  'margin-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'border-t',
  'border-width',
  'box-sizing'
];

export function getNodeString(targetElement,styleType) {

  if(!targetElement){
    return
  }

  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing');

  styleType = (styleType === 'width' || styleType === 'height')? styleType:'width';

  const configStyle = {
    'width' : {0:'left', 1:'right'},
    'height':{0:'bottom', 1:'top'}
  }

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-'+configStyle[styleType])) +
    parseFloat(style.getPropertyValue('padding-'+configStyle[styleType]))
  );
  const marginSize = (
    parseFloat(style.getPropertyValue('margin-'+configStyle[styleType])) +
    parseFloat(style.getPropertyValue('margin-'+configStyle[styleType]))
  );
  const borderSize = (
    parseFloat(style.getPropertyValue('border-'+configStyle[styleType]+'-width')) +
    parseFloat(style.getPropertyValue('border-'+configStyle[styleType]+'-width'))
  );

  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return { contextStyle,paddingSize,marginSize ,borderSize,boxSizing};
}
