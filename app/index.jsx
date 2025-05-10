import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <Button title="wellcome" onPress={()=>router.push('Welcome')} />
    </View>
  )
}

export default index