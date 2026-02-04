import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonSpinner,
  IonIcon,
  IonButton
} from '@ionic/react';
import { alertCircleOutline, searchOutline } from 'ionicons/icons';
import axios from 'axios';
import './Home.css';

interface Character {
  id: number;
  name: string;
  gender: string;
  species: string;
  status: string;
  image: string;
}
const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://futuramaapi.com/api/characters', {
        params: {
          orderBy: 'id',
          orderByDirection: 'asc',
          page: 1,
          size: 50
        }
      });
      
      if (response.data && Array.isArray(response.data.items)) {
        setCharacters(response.data.items);
      } else {
        setCharacters([]);
      }
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Hubo un problema al cargar los datos de la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const refresh = async (e: CustomEvent) => {
    await fetchCharacters();
    e.detail.complete();
  };

  return (
    <IonPage id="home-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Personajes de futurama</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Personajes de futurama</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" color="primary" />
            <p>Cargando personajes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="ion-text-center ion-padding">
            <IonIcon icon={alertCircleOutline} color="danger" size="large" />
            <p style={{ color: 'var(--ion-color-danger)' }}>{error}</p>
            <IonButton onClick={() => fetchCharacters()} color="primary" size="small">
              Reintentar
            </IonButton>
          </div>
        )}

        {!loading && !error && characters.length === 0 && (
          <div className="ion-text-center ion-padding">
            <IonIcon icon={searchOutline} size="large" />
            <p>No se encontraron personajes.</p>
          </div>
        )}

        {!loading && characters.length > 0 && (
          <IonList>
            {characters.map((character, index) => (
              <IonItem key={character.id}>
                <IonText slot="start" className="ion-padding-end">{index + 1}</IonText>
                <IonAvatar slot="start" className="large-avatar">
                  <img src={character.image || "https://media.istockphoto.com/id/1162198273/es/vector/dise%C3%B1o-de-ilustraci%C3%B3n-vectorial-plana-icono-de-signo-de-interrogaci%C3%B3n.jpg?s=612x612&w=0&k=20&c=ZP_KrHAiZiMLttztdGIegaJlNhBYCvsyr0S9-irTTTM="} className='imagen-grande' alt={character.name} />
                </IonAvatar>
                <IonLabel>
                  <h2>{character.name}</h2>
                  <p>Género: {character.gender}</p>
                  <p>
                    Estado: <IonText color={character.status === 'ALIVE' ? 'success' : (character.status === 'DEAD' ? 'danger' : (character.status === 'UNKNOWN' ? 'warning' : 'medium'))}>
                      {character.status}
                    </IonText>
                  </p>
                  <p>Especie: <IonText color={character.species === 'HUMAN' ? 'primary' : (character.species === 'MONSTER' ? 'tertiary' : 'medium')}>
                    {character.species}
                  </IonText>
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
