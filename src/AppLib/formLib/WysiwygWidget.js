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

    const { value } = this.props
    this.state = this.handleState( value, null, false )
  }
  
  // this method could switch between sync and async based on the updateState argument
  handleState (newHtml, newEditorState, updateState = true) {
    // we will not have a state at the instance construction, so lets make sure
    // we emulate an empty object for both state and props
    const { html, editorState } = this.state || {}
    const { blockType } = this.props || {}
    let state = {}

    // we dont have the html nor the editorState
    if ( isEmpty(newHtml) && ! newEditorState ) {
      state = {
        html: '',
        editorState: isEmpty( blockType ) ? (
          EditorState.createEmpty()
        ):(
          EditorState.createWithContent(
            ContentState.createFromBlockArray([
              new ContentBlock({
                type: blockType
              })
            ])
          )
        )
      }

      return updateState ? this.setState(state) : state
    }

    // we have a new html which is different from the state's html (editor state doesnt matter here)
    if ( ! isEmpty( newHtml ) && newHtml != html ) {
      state = {
        html: newHtml,
        editorState: EditorState.createWithContent(
          stateFromHTML(newHtml)
        )
      }

      return updateState ? this.setState(state) : state
    }

    // we have an updated editorState, lets create the html version from it
    if ( newEditorState ) {
      state = {
        html: draftToHtml(convertToRaw(newEditorState.getCurrentContent())),
        editorState: newEditorState,
      }

      return updateState ? this.setState(state) : state
    }

    // do nothing
    return {}
  }

  // lets take advantage of the lifecycle events to manage the state directly (advanced)
  componentWillReceiveProps = ({ value }) => {
    this.state = { ...this.state, ...this.handleState( value, null, false) }
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

    return this.handleState(
      null,
      EditorState.push(editorState, newState, 'insert-fragment')
    );
  }

  onEditorStateChange = async (editorState) => {
    this.handleState(null, editorState)
    const { html } = this.state

    const { onChange } = this.props
    if ( typeof onChange == 'function' ) {
      await onChange(html)
    }
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
