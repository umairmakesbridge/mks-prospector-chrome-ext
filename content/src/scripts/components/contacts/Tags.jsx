import React from 'react';
import {encodeHTML,decodeHTML} from '../common/Encode_Method';

const ContactTags = (props) => {
  console.log(props.tags);
  console.log(encodeHTML());
  if(!props.tags){
    return (<div><p className="not-found">No tags available.</p></div>)
  }
  const deleteTag = props.deleteTag;
  const tags = props.tags.split(',');
  const tagItems = tags.map((tag) =>
      <li key={tag}>
        <a className="tag">
          <span>{decodeHTML(tag)}</span>
          <i className="icon cross" onClick={() => deleteTag(tag) }></i>
        </a>

      </li>
    );
    return (
      <ul>{tagItems}</ul>
    );
}

export default ContactTags;
