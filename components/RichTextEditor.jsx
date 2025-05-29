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
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        selectedIconTint={theme.colors.primaryDark}
        editor={editorRef}
        disabled={false}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({});
