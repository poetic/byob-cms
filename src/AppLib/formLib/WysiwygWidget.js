import React, { Component } from 'react'
import { isEmpty } from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, ContentBlock, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { stateFromHTML } from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class WysiwygWidget extends Component {
  constructor(props) {
    super(props);

    const { value, options: { blockType } } = this.props;

    if (!isEmpty(value)) {
      const contentState = stateFromHTML(value)

      this.state = {
        editorState: EditorState.createWithContent(contentState),
      }
    } else if (!isEmpty(blockType)) {
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

    this.handlePastedText = this.handlePastedText.bind(this);
  }
  
  componentWillReceiveProps = nextProps => {
    const { value } = nextProps;
    if (!isEmpty(value)) {
      const contentState = stateFromHTML(value)

      this.state = {
        editorState: EditorState.createWithContent(contentState),
      }
    }
  }

  handlePastedText = (text, html) => {

    const { editorState } = this.state

    const blockMap = stateFromHTML(html).blockMap

    const newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap)

    this.setState({
      editorState: EditorState.push(editorState, newState, 'insert-fragment'),
    });

    return true;
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
    
    const { onChange } = this.props;

    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  render() {
    const { editorState } = this.state;
    const { options: { wysiwygConfig }} = this.props;

    return (
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        handlePastedText={this.handlePastedText}
        {...wysiwygConfig}
      />
    )
  }
}

export default WysiwygWidget;
