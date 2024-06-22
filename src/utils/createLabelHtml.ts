export const createLabelHtml = (label: string): HTMLElement => {
  const labelHtml = document.createElement('label');
  labelHtml.innerHTML = label;
  labelHtml.style.fontSize = '1.2rem';
  labelHtml.style.fontWeight = 'bold';
  labelHtml.style.color = '#222222';
  return labelHtml;
};
