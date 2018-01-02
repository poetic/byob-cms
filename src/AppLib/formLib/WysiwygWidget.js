import React, { Component } from 'react'
import { isEmpty } from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML, ContentBlock } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WysiwygWidget extends Component {
  constructor(props) {
    super(props);

    const { value, options: { blockType } } = this.props;

    if (!isEmpty(value)) {
      this.state = {
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(value)
          )
        ),
      }
    } else {
      if (!isEmpty(blockType)) {
        this.state = {
          editorState: EditorState.createWithContent(ContentState.createFromBlockArray([new ContentBlock({
            type: blockType
          })])),
        }
      } else {
        this.state = {
          editorState: EditorState.createEmpty(),
        }
      }
    }
    
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
    
    const { onChange } = this.props;

    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };

  render() {
    const { editorState } = this.state;
    const { options: { 
      toolbar,
      editorClassName,
    }} = this.props;


    return (
      <div className="rdw-storybook-root">
        <Editor
          editorState={editorState}
          toolbar={{
            options: toolbar,
          }}
          editorClassName={editorClassName}
          onEditorStateChange={this.onEditorStateChange}
        />
        <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </div>
    )
  }
}

export default WysiwygWidget;