import React, { Component } from 'react'
import { isEmpty } from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import {
  EditorState,
  convertToRaw,
  ContentState,
  ContentBlock,
  Modifier,
  CharacterMetadata,
  genKey,
} from 'draft-js';
import { List, Repeat } from 'immutable';
import draftToHtml from 'draftjs-to-html';
import { stateFromHTML } from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { getSelectedBlocksType } from 'draftjs-utils';

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

    // this.handlePastedText = this.handlePastedText.bind(this);
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
    const linesFromText = text.split('\n');

    const { editorState } = this.state;

    const currentBlockType = getSelectedBlocksType(editorState);

    const contentBlocksArray = linesFromText.map(line => {
      return new ContentBlock({
        key: genKey(),
        type: currentBlockType,
        characterList: new List(Repeat(CharacterMetadata.create(), line.length)),
        text: line,
      });
    });

    const blockMap = ContentState.createFromBlockArray(contentBlocksArray).blockMap;

    const newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);

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
