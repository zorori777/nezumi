import _ from 'lodash';
import * as selector from './selector';

export const capybarizeClick = (data) => {
  const element = data.element || {};
  const tag = element.tagName || '';

  switch (tag) {
    case 'a':
    case 'button':
      return codeForClickLinkOrButton(data, tag);
    default:
      return codeForClick(data, tag);
  }
};

export const codeForClickLinkOrButton = (data, tag) => {
  const method = {
    'a': 'click_link',
    'button': 'click_button',
  }[tag];

  if (!method) return null;

  const { locator, kind } = selector.toTextSelector(data);

  if (kind === 'text' || kind === 'id') return `${method} '${locator}'`;

  if (kind === 'xpath') return `find(:${kind}, '${locator}').click`;

  return `find('${locator}').click`;
};

export const codeForClick = (data, tag) => {
  const { locator, kind } = selector.toTextSelector(data);

  if (kind === 'text') return `find('${tag}', text: /\\A${_.escapeRegExp(locator)}\\z/).click`;

  if (kind === 'id') return `find_by_id('${locator}').click`;

  if (kind === 'xpath') return `find(:${kind}, '${locator}').click`;

  return `find('${locator}').click`;
};
