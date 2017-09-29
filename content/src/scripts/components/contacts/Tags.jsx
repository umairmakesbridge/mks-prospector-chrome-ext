import React from 'react';

const ContactTags = (props) => {
  console.log(props.tags);
  const deleteTag = props.deleteTag;
  const tags = props.tags.split(',');
  const tagItems = tags.map((tag) =>
      <li key={tag}>
        <a className="tag">
          <span>{tag}</span>
          <i className="icon cross" onClick={() => deleteTag(tag) }></i>
        </a>

      </li>
    );
    return (
      <ul>{tagItems}</ul>
    );
}

export default ContactTags;
