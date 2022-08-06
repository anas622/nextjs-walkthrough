import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";


function HomePage(props) {
  return <MeetupList meetups={props.meetups} />;
}

//static generation during the build, and based on revalidate value
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:QKGsAZQN1kYyqvj2@cluster0.c8lqdbw.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => {
        return {
          title: meetup.title,
          address: meetup.address,
          image: meetup.image,
          id: meetup._id.toString(),
        };
      }),
    },
    revalidate: 300, //the page will be regenerated statically on the server after this many seconds
  };
}

export default HomePage;
