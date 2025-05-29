import { StyleSheet, View } from "react-native";
import { actions, RichToolbar } from "react-native-pell-rich-editor";

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.line,
        ]}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        editor={editorRef}
        disabled={false}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({});
