<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

final class DeletePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        assert($user instanceof User);

        $post = $this->route('post');
        assert($post instanceof Post);

        return $user->id === $post->user_id;
    }

    /**
     * @return array{}
     */
    public function rules(): array
    {
        return [];
    }
}
