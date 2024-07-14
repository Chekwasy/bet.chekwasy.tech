import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function About() {
    const params = useParams();
  return (
    <div className='about_comp'>
      <div className='about_box'>
        <h3>bet.chekwasy</h3>
        <div>A classic and unique platform to play bet but without real funds
          Test your betting skills to earn more with betting sites. <br />
          Support us in any way to expand betting types to Over/Under, and others
          including other sports<br />
          reach us via  bet.chekwasy@gmail.com
        </div>
      </div>
    </div>
  );
}

export default About;