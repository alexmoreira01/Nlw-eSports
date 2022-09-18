import { useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

import LogoImg from '../../assets/logo-nlw-esports.png';

import { THEME } from '../../theme';
import { styles } from './styles';

import { GameParams } from '../../@types/navigation';
import { Heading } from '../../components/Heading';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')

  // Resgatar informações que veem da rotas
  const route = useRoute();
  const navigation = useNavigation();
  const game = route.params as GameParams;

  function handleGoBack(){
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string){
    fetch(`http://192.168.1.11:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    // .then(data=> console.log(data[0].name))
    .then(data=> setDiscordDuoSelected(data.discord))
  }

  useEffect(() => {
    fetch(`http://192.168.1.11:3333/games/${game.id}/ads`)
    .then(response => response.json())
    // .then(data=> console.log(data[0].name))
    .then(data=> setDuos(data))
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            source={LogoImg}
            style={styles.logo}
          />

          <View style={styles.right}/>

        </View>

        <Image
          source={{uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"

        />

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard 
              data={item} 
              onConnect={()=> getDiscordUser(item.id)}  
            />
          )}
          horizontal
          style={styles.containerList}
          // Se usa [ ] para passar mais estilos -- Aqui ira definir um estilo padrao poara a mensagem caso não tenha anuncios
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anuncios publicados ainda!
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0 }
          discord={discordDuoSelected}
          onCLose={() => setDiscordDuoSelected('')}
        />

      </SafeAreaView>
    </Background>
  );
}