<?php

declare(strict_types=1);

use App\Enums\CommitStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commits', function (Blueprint $table): void {
            $table->string('status')->default(CommitStatus::Pending->value);

            $table->index(['status', 'created_at']);
        });

        DB::table('commits')->update(['status' => CommitStatus::Approved->value]);
    }
};
