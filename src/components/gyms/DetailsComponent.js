import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

// const DetailsComponent = (props) => {
class DetailsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentReview: '',
            commentTitle: '',
            commentRating: '',
            theGymsComments: []
        }
    }

    showComments = () => {
        let commentArray = []
        this.props.gymComments.forEach(oneComment => {
            console.log("the for each in the details >>>>>>>>>>>>>> )))))))))))))) ", oneComment.gym.toString(), this.props.theGymId.toString())
            if (String(oneComment.gym) === String(this.props.theGymId)) {
                commentArray.push(oneComment);
                // this.state.theGymsComments.push(oneComment);   // maybe a little problematic <<<<<<<<<< 
            }
        })

        // this.setState({theGymsComments: commentArray}, ()=>{

        console.log("the state info in the details _______________ ", this.state)
        if (commentArray.length > 0) {
            // this.setState({theGymsComments: commentArray})
            // if(this.state.theGymsComments.length === 0 && this.props.gymComments.length > 0) {
            //     this.setState({theGymsComments: [...this.props.gymComments]})
            // }   
            return commentArray.map((oneComment, i) => {
                console.log("the gym comments >>>>><<<<<<<<>>>>>>>><<<<<<<<<>>>>>> ", oneComment);
                return (
                    <div key={i}>
                        <div>
                            <h4>UserName: {oneComment.owner.username}</h4>
                            <h4>Rating: {oneComment.rating}</h4>
                        </div>
                        <div>
                            <h4>Title: {oneComment.title}</h4>
                            <h5>Content: {oneComment.content}</h5>
                        </div>
                    </div>
                )
            })
        }




        // })


    }

    commentCreate = (event) => {
        event.preventDefault()
        console.log("calling the create route <<<<<<< ", this.state)
        // Axios.post(`https://jiu-jitsu-locator.herokuapp.com/reviews/create`, {
        Axios.post(process.env.REACT_APP_API_URL, {
            title: this.state.commentTitle,
            content: this.state.commentReview,
            rating: this.state.commentRating,
            gymid: this.props.theGymId
        }, { withCredentials: true })
            .then(newlyCreatedComment => {
                console.log("the review that was created >>>>>>> ", newlyCreatedComment.data);
                this.setState({
                    commentReview: '',
                    commentTitle: '',
                    commentRating: '',
                    theGymsComments: [...this.props.gymComments].push(newlyCreatedComment.data)
                })
                this.props.getComments();
                // this.props.push('/')
            }).catch(err => console.log("error creating review ", err))
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }


    render() {
        console.log("the props in the details ", this.props);
        return (
            <div style={{ height: '300px', borderRadius: '4px', width: '30%', float: 'left', margin: '10px', padding: '10px' }}>

                {this.props.info.name && <h2>{this.props.info.name}</h2>}
                {this.props.info.formatted_phone_number && <h4>{this.props.info.formatted_phone_number}</h4>}
                {this.props.info.website && <h4>Website         {this.props.info.website}</h4>}
                {this.props.info.photos && <img src={this.props.photo} alt="" />}
                {this.props.info.rating && <div style={{ fontSize: `30px` }}><img style={{ height: '120px' }} src="https://icon-library.net/images/star-rating-icon/star-rating-icon-20.jpg" />{this.props.info.rating}</div>}
                {this.props.info.name &&
                    <form action="/create" method="post" onSubmit={this.commentCreate}>
                        <div>
                            <h3 style={{textAlign: 'center'}}>Leave Your Own Review</h3>
                            <label>Title:</label>
                            <input name="commentTitle" value={this.state.title} onChange={(e) => this.handleChange(e)} />
                            {/* <textarea name="comments" id={this.props.info.name} style={{fontFamily: 'sans-serif', fontSize: '1.2em', border: '1px solid black'}}>
                                Hey... say something here!
                        </textarea> */}
                            <br />
                            <label>Rating:</label>
                            <input name="commentRating" value={this.state.rating} onChange={(e) => this.handleChange(e)} />
                            <br />
                            <label>Comment:</label>
                            <input name="commentReview" value={this.state.review} onChange={(e) => this.handleChange(e)} />
                        </div>
                        <input style={{ border: '1px solid black' }} type="submit" value="Submit" />
                    </form>
                }
                {this.showComments()}


            </div>
        )
    }
}

export default DetailsComponent;
