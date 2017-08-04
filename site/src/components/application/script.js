import Connexion from '@/components/connexion'
import ProjectsHub from '@/components/projects-hub'

export default
{
    name: 'application',

    components:
    {
        Connexion,
        ProjectsHub
    },

    data()
    {
        return {
            counter: 0
        }
    },

    computed:
    {
        projects()
        {
            return this.$store.state.projects
        }
    },

    mounted()
    {
        window.setInterval(() =>
        {
            this.counter++
        }, 1000)
    }
}